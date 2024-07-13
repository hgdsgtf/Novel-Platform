package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBString, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*

case class AuditorGetCommentMessagePlanner(
    title: String,
    chapter: Int,
    override val planContext: PlanContext
) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    try {
      readDBString(
        s"SELECT writerreason FROM novel.${schemaName} WHERE title = ? AND chapter = ${chapter}",
        List(
          SqlParameter("String", title)
        )
      )
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
