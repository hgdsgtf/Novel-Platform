package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, writeDB}
import Common.ServiceUtils.schemaName
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.generic.auto._
import io.circe.syntax._
import io.circe.parser.decode
import io.circe.{Decoder, HCursor}

case class ReaderMakeChapterRatePlanner(
                                         title: String,
                                         chapter: Int,
                                         rating: Int,
                                         username: String, // 新增 username 参数
                                         override val planContext: PlanContext
                                       ) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    try {
      // Read existing ratings
      val readRatingsIO: IO[Array[Int]] = readDBRows(
        s"SELECT ratings FROM ${schemaName}.chapter_rating WHERE title = ? AND chapter = ?",
        List(SqlParameter("String", title), SqlParameter("Int", chapter.toString))
      ).map(_.headOption.flatMap(json => decode[Array[Int]](json.hcursor.downField("ratings").focus.get.noSpaces).toOption).getOrElse(Array.empty[Int]))

      // Calculate the new ratings array and average rating
      val updateRatingsAndCalculateAverage = readRatingsIO.flatMap { existingRatings =>
        val updatedRatings = existingRatings :+ rating
        val averageRating = BigDecimal(updatedRatings.sum) / updatedRatings.length
        IO.pure((updatedRatings, averageRating.setScale(1, BigDecimal.RoundingMode.HALF_UP).toDouble))
      }

      updateRatingsAndCalculateAverage.flatMap { case (updatedRatings, averageRating) =>
        val ratingsArrayString = "{" + updatedRatings.mkString(",") + "}"

        // Check if chapter rating exists
        val checkChapterRatingExistsIO = readDBRows(
          s"SELECT 1 FROM ${schemaName}.chapter_rating WHERE title = ? AND chapter = ?",
          List(SqlParameter("String", title), SqlParameter("Int", chapter.toString))
        ).map(_.nonEmpty)

        // Update or insert chapter rating record with new ratings and average rating
        checkChapterRatingExistsIO.flatMap { exists =>
          val updateOrInsertChapterRatingIO = if (exists) {
            writeDB(
              s"UPDATE ${schemaName}.chapter_rating SET ratings = '$ratingsArrayString'::integer[], rating = $averageRating WHERE title = '$title' AND chapter = $chapter",
              List.empty
            )
          } else {
            writeDB(
              s"INSERT INTO ${schemaName}.chapter_rating (title, chapter, ratings, rating) VALUES ('$title', $chapter, '$ratingsArrayString'::integer[], $averageRating)",
              List.empty
            )
          }
          val insertReaderRatingIO = writeDB(
            s"INSERT INTO ${schemaName}.reader_chapter_ratings (readername, noveltitle, chapter_id, rating) VALUES (?, ?, ?, ?)",
            List(
              SqlParameter("String", username),
              SqlParameter("String", title),
              SqlParameter("Int", chapter.toString),
              SqlParameter("Int", rating.toString)
            )
          ).handleErrorWith {
            case e: Exception => IO.pure(s"Rating already exists for user: $username, chapter: $chapter")
          }

          // Execute both write operations
          for {
            _ <- updateOrInsertChapterRatingIO
            _ <- insertReaderRatingIO
          } yield "Rating added successfully"
        }
      }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error: " + e.getMessage))
    }
  }
}
