package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import io.circe.Json
import Common.DBAPI.readDBString

case class WriterGetCommentMessagePlanner(
    title: String,
    chapter: Int,
    override val planContext: PlanContext
) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    try {
      readDBString(
        s"SELECT auditorcomment FROM ${schemaName}.novel WHERE title = ? AND chapter = ${chapter}",
        List(
          SqlParameter("String", title)
        )
      )
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
