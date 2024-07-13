package Impl
import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import io.circe.generic.auto._
import io.circe.syntax._
import io.circe.parser.decode
import io.circe.{Encoder, Decoder, HCursor}

case class ReaderMakeNovelRatePlanner(
    title: String,
    rating: Int,
    username: String,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    try {
      // Read existing ratings
      val readRatingsIO: IO[Array[Int]] = readDBRows(
        s"SELECT ratings FROM ${schemaName}.novelInfo WHERE title = ?",
        List(SqlParameter("String", title))
      ).map(
        _.headOption
          .flatMap(json =>
            decode[Array[Int]](
              json.hcursor.downField("ratings").focus.get.noSpaces
            ).toOption
          )
          .getOrElse(Array.empty[Int])
      )

      // Calculate the new ratings array and average rating
      val updateRatingsAndCalculateAverage = readRatingsIO.flatMap {
        existingRatings =>
          val updatedRatings = existingRatings :+ rating
          val averageRating =
            BigDecimal(updatedRatings.sum) / updatedRatings.length
          IO.pure(
            (
              updatedRatings,
              averageRating
                .setScale(1, BigDecimal.RoundingMode.HALF_UP)
                .toDouble
            )
          )
      }

      updateRatingsAndCalculateAverage.flatMap {
        case (updatedRatings, averageRating) =>
          // Update the novel rating record with new ratings and average rating
          val updateNovelRatingIO = writeDB(
            s"UPDATE ${schemaName}.novelInfo SET ratings = ratings || ${rating}, rating = ${averageRating} WHERE title = ?",
            List(
              SqlParameter("String", title)
            )
          )

          // Insert into reader's novel rating table
          val insertReaderRatingIO = writeDB(
            s"INSERT INTO ${schemaName}.reader_novel_ratings (readername, novelname, rating) VALUES (?, ?, ?)",
            List(
              SqlParameter("String", username),
              SqlParameter("String", title),
              SqlParameter("Int", rating.toString)
            )
          )

          // Execute both write operations
          for {
            _ <- updateNovelRatingIO
            _ <- insertReaderRatingIO
          } yield "Rating added successfully"
      }
    } catch {
      case e: Exception =>
        IO.raiseError(new Exception("System error: " + e.getMessage))
    }
  }
}
