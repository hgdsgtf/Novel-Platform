package Impl

import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import APIs.WriterAPI.WriterInfoMessage

case class WriterInfoPlanner(override val planContext: PlanContext) extends Planner[List[Json]] {
  override def plan(using planContext: PlanContext): IO[List[Json]] = {
    try {
      readDBRows(s"SELECT writeruser, writeremail FROM ${schemaName}.writeremail_writeruser_writerpassword_writerbook",List())
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
