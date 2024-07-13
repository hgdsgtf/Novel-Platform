package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBRows, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class DeleteWriterMessagePlanner(userName: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    // Check if the author exists
    val checkAuthorExists = readDBBoolean(
      s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.writeremail_writeruser_writerpassword_writerbook WHERE writeruser = ?)",
      List(SqlParameter("String", userName))
    )
    checkAuthorExists.flatMap { exists =>
      if (!exists) {
        IO.raiseError(new Exception("Author does not exist"))
      } else {
        /*
        // Delete novels authored by this writer
        val deleteNovelsIO = writeDB(
          s"DELETE FROM novel.novel WHERE title = ANY (SELECT unnest(writerbook) FROM ${schemaName}.writeremail_writeruser_writerpassword_writerbook WHERE writeruser = ?)",
          List(SqlParameter("String", userName))
        )*/
        // 感觉这一段删小说的应该单独做一个微服务，但还没搞定
        // Delete author record
        val deleteAuthorIO = writeDB(
          s"DELETE FROM ${schemaName}.writeremail_writeruser_writerpassword_writerbook WHERE writeruser = ?",
          List(SqlParameter("String", userName))
        )
        deleteAuthorIO.flatMap { _ =>
            IO.pure("Author and related novels deleted successfully")
        }.handleErrorWith { error =>
          IO.raiseError(new Exception(s"Failed to delete novels: ${error.getMessage}"))
        }
      }
    }
  }
}
