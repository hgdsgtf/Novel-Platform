package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBRows, readDBString, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*

case class AuditorGetIssuesMessagePlanner(
    title: String,
    chapter: Int,
    override val planContext: PlanContext
) extends Planner[List[Json]]:
  override def plan(using PlanContext): IO[List[Json]] = {
    try {
      readDBRows(
        s"SELECT issues FROM ${schemaName}.novel WHERE title = ? AND chapter = ${chapter}",
        List(SqlParameter("String", title))
      )
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
