package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, writeDB, *}
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class RegisterWriterRequestPlanner(
    userName: String,
    userEmail: String,
    password: String,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    try {
      writeDB(
        s"INSERT INTO ${schemaName}.writeremail_writeruser_writerpassword_writerbook (writeremail, writeruser, writerpassword, writerbook) VALUES (?, ?, ?, '{}')",
        List(
          SqlParameter("String", userEmail),
          SqlParameter("String", userName),
          SqlParameter("String", password)
        )
      )
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
