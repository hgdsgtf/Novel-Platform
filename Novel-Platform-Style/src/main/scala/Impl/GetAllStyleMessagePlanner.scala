package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBInt, readDBRows, readDBString, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*

case class GetAllStyleMessagePlanner(
                                       override val planContext: PlanContext
                                     ) extends Planner[List[Json]] {
  override def plan(using PlanContext): IO[List[Json]] = {
    try {
      readDBRows(
        s"SELECT id, stylename FROM ${schemaName}.homepage", List()
      )
    }catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
