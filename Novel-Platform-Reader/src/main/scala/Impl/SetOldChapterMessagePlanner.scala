package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBRows, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto._

case class SetOldChapterMessagePlanner(
    userName: String,
    title: String,
    chapter: Int,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    try {
      val checkPairExists = readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.readeruser_readerbook_readeroldchapters WHERE readeruser = ? AND readerbook = ?)",
        List(SqlParameter("String", userName), SqlParameter("String", title))
      )

      checkPairExists.flatMap { pairExists =>
        if (!pairExists) {
          // Add new user record with book and chapter
          writeDB(
            s"INSERT INTO ${schemaName}.readeruser_readerbook_readeroldchapters (readeruser, readerbook, readeroldchapters) VALUES (?, ?, ARRAY[${chapter}])",
            List(
              SqlParameter("String", userName),
              SqlParameter("String", title)
            )
          ).map(_ => "Book added successfully")
        } else {
          val checkChapterExists = readDBBoolean(
            s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.readeruser_readerbook_readeroldchapters WHERE readeruser = ? AND readerbook = ? AND ${chapter} = ANY(readeroldchapters))",
            List(
              SqlParameter("String", userName),
              SqlParameter("String", title)
            )
          )
          checkChapterExists.flatMap { chapterExists =>
            if (chapterExists) {
              IO.pure("Chapter added successfully")
            } else {
              writeDB(
                s"UPDATE ${schemaName}.readeruser_readerbook_readeroldchapters SET readeroldchapters = readeroldchapters || ${chapter} WHERE readeruser = ? AND readerbook = ?",
                List(
                  SqlParameter("String", userName),
                  SqlParameter("String", title)
                )
              ).map(_ => "Chapter added successfully")
            }
          }
        }
      }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
