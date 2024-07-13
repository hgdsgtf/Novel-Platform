package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class RegisterReaderRequestPlanner(
    userName: String,
    userEmail: String,
    password: String,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // Check if the user is already registered
    try {
      writeDB(
        s"INSERT INTO ${schemaName}.readeremail_readeruser_readerpassword_readerbook_readermoney (readeremail, readeruser, readerpassword, readerbook, readermoney) VALUES (?, ?, ?, '{}', 0)",
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
