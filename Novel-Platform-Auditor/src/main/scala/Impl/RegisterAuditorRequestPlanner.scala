package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import java.sql.SQLException

sealed trait DBError extends Exception

case object InvalidParameterError extends DBError

case class SQLError(exception: SQLException) extends DBError

case class UnknownError(exception: Throwable) extends DBError

case class RegisterAuditorRequestPlanner(
    userName: String,
    userEmail: String,
    password: String,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    writeDB(
      s"INSERT INTO ${schemaName}.auditoremail_auditoruser_auditorpassword_auditorstatus (auditoremail, auditoruser, auditorpassword, auditorstatus) VALUES (?, ?, ?, FALSE)",
      List(
        SqlParameter("String", userEmail),
        SqlParameter("String", userName),
        SqlParameter("String", password)
      )
    )
  }
}
