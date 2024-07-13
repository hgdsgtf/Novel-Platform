package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBRows, readDBString}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*

case class ReaderGetAccessMessagePlanner(
    userName: String,
    title: String,
    chapter: Int,
    override val planContext: PlanContext
) extends Planner[Boolean] {
  override def plan(using planContext: PlanContext): IO[Boolean] = {
    try {
      // Check if the  title already exists
      readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.novel WHERE title = ? AND chapter = ${chapter} AND ? = ANY(reader))",
        List(SqlParameter("String", title), SqlParameter("String", userName))
      )
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
