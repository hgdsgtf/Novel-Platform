package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBRows, readDBString, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*

case class AddNovelMessagePlanner(
    userName: String,
    title: String,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    try {
      val checkBookExists = readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.readeremail_readeruser_readerpassword_readerbook_readermoney WHERE readeruser = ? AND ? = ANY(readerbook))",
        List(SqlParameter("String", userName), SqlParameter("String", title))
      )
      checkBookExists.flatMap { bookExists =>
        if (bookExists) {
          IO.raiseError(new Exception("Book already added"))
        } else {
          writeDB(
            s"UPDATE ${schemaName}.readeremail_readeruser_readerpassword_readerbook_readermoney SET readerbook = readerbook || ? WHERE readeruser = ?",
            List(
              SqlParameter("String", title),
              SqlParameter("String", userName)
            )
          ).map { _ => "Added successfully" }
        }
      }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
