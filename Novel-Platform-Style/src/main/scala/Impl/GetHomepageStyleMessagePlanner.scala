package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{
  readDBBoolean,
  readDBInt,
  readDBRows,
  readDBString,
  writeDB
}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*

case class GetHomepageStyleMessagePlanner(
    id: Int,
    override val planContext: PlanContext
) extends Planner[List[Json]] {
  override def plan(using PlanContext): IO[List[Json]] = {
    try {
      readDBRows(
        s"SELECT * FROM ${schemaName}.homepage WHERE id = ${id}",
        List()
      )
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
