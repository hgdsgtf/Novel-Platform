package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, decodeType}
import Common.ServiceUtils.schemaName
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto._
import io.circe.syntax._
import Common.DBAPI.readDBBoolean
import Common.DBAPI.writeDB

case class WriterAddChapterMessagePlanner(
    title: String,
    author: String,
    chapter: Int,
    chapterName: String,
    content: String,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    try {
      // Check if the novel title already exists
      val contentLength = content.length
      val chapterprice = contentLength / 10
      val checkChapterExists = readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.novel WHERE title = ? AND chapter = ${chapter})",
        List(SqlParameter("String", title))
      )
      val insertNovelIO = writeDB(
        s"INSERT INTO ${schemaName}.novel (title, author, chapter, chaptername, price, content, filteredcontent, status, reader, issues, writerreason, auditorcomment) VALUES (?, ?, ${chapter}, ?, ?, ?, ?, 0, '{}', '{}', '', '')",
        List(
          SqlParameter("String", title),
          SqlParameter("String", author),
          SqlParameter("String", chapterName),
          SqlParameter("Int", chapterprice.toString),
          SqlParameter("String", content),
          SqlParameter("String", content)
        )
      )
      checkChapterExists
        .flatMap { exists =>
          if (exists) {
            IO.raiseError(new Exception("Chapter already exists"))
          } else {
            insertNovelIO
              .flatMap { _ =>
                IO.pure("Chapter added successfully")
              }
          }
        }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
