package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, decodeType}
import Common.ServiceUtils.schemaName
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto._
import io.circe.syntax._

case class ReaderGetChaptersMessagePlanner(
    title: String,
    userName: String,
    override val planContext: PlanContext
) extends Planner[List[Json]] {
  override def plan(using planContext: PlanContext): IO[List[Json]] = {
    val query =
      s"SELECT * FROM ${schemaName}.novel WHERE title = ? ORDER BY chapter ASC"
    val params = List(SqlParameter("String", title))
    try {
      readDBRows(query, params)
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
