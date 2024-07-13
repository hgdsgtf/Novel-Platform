package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{decodeType, readDBRows, readDBString}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class GetAuthorMessagePlanner(
    title: String,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val query =
      s"SELECT DISTINCT author FROM ${schemaName}.novel WHERE title = ?"
    val params = List(SqlParameter("String", title))
    try {
      readDBString(query, params)
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
