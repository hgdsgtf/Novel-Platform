package Impl

import APIs.ReaderAPI.RegisterMessage
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class ResetMessagePlanner(
    userName: String,
    password: String,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // Check if the user is already registered
    try {
      writeDB(s"UPDATE ${schemaName}.readeremail_readeruser_readerpassword_readerbook_readermoney SET readerpassword = ? WHERE readeruser = ?", List(SqlParameter("String", password), SqlParameter("String", userName)))
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
