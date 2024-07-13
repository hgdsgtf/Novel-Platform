package Impl

import APIs.ReaderAPI.RegisterMessage
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class GetUsernameMessagePlanner(
    email: String,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // Check if the user is already registered
    try {
      val checkUserExists = readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.readeremail_readeruser_readerpassword_readerbook_readermoney WHERE readeremail = ?)",
        List(
          SqlParameter("String", email)
        )
      )
      checkUserExists.flatMap { exists =>
        if (!exists) {
          IO.raiseError(new Exception("Email doesn't exist"))
        } else {
          readDBString(
            s"SELECT readeruser FROM ${schemaName}.readeremail_readeruser_readerpassword_readerbook_readermoney WHERE readeremail = ?",
            List(SqlParameter("String", email))
          )
        }
      }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
