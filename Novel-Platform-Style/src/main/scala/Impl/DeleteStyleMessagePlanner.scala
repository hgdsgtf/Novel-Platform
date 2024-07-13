package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBInt, readDBRows, readDBString, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*

case class DeleteStyleMessagePlanner(
                                      id: Int,
                                      override val planContext: PlanContext
                                    ) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    try {
      writeDB(
        s"DELETE FROM ${schemaName}.homepage WHERE id = ?",
        List(
          SqlParameter("Int", id.toString)
        )
      ).map { _ => "Deleted successfully" }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}