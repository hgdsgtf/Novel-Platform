package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, decodeType}
import Common.ServiceUtils.schemaName
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto._
import io.circe.syntax._

case class AuditorGetChaptersMessagePlanner(
    override val planContext: PlanContext
) extends Planner[List[Json]] {
  override def plan(using planContext: PlanContext): IO[List[Json]] = {
    val query =
      s"SELECT * FROM ${schemaName}.novel WHERE status <> 1 AND status <> 3 ORDER BY title ASC, chapter ASC"
    try {
      readDBRows(query, List())
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
