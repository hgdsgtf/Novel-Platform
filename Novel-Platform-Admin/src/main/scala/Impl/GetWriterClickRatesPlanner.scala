package Impl

import Common.API.{PlanContext, Planner}
import cats.effect.IO
import io.circe.generic.auto.*
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import io.circe.Json

case class GetWriterClickRatesPlanner(authorName: String, override val planContext: PlanContext) extends Planner[List[Json]] {
  override def plan(using planContext: PlanContext): IO[List[Json]] = {
    try {
      readDBRows(
        s"SELECT date, clicks FROM ${schemaName}.writer_date_clicks WHERE writer = ? ORDER BY date",
        List(SqlParameter("String", authorName))
      )
    } catch {
      case e: Exception => IO.raiseError(new Exception("Database operation failed"))
    }
  }
}