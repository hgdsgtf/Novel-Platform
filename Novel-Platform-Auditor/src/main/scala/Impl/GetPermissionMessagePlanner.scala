package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBString, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class GetPermissionMessagePlanner(
    userName: String,
    override val planContext: PlanContext
) extends Planner[Boolean]:
  override def plan(using PlanContext): IO[Boolean] = {
    try {
      val checkUserExists = readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.auditoremail_auditoruser_auditorpassword_auditorstatus WHERE auditoruser = ?)",
        List(SqlParameter("String", userName))
      )
      checkUserExists.flatMap { exists =>
        if (exists) {
          readDBBoolean(
            s"SELECT auditorstatus from ${schemaName}.auditoremail_auditoruser_auditorpassword_auditorstatus WHERE auditoruser = ?",
            List(SqlParameter("String", userName))
          )
        } else {
          IO.raiseError(new Exception("Auditor doesn't exist"))
        }
      }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
