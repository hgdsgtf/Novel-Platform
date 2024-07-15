package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.writeDB
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto._

case class DeletePagesStyleMessagePlanner(
                                           pageName: String,
                                           id: Int,
                                           override val planContext: PlanContext
                                         ) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    try {
      val query = s"DELETE FROM ${schemaName}.$pageName WHERE id = ?"
      writeDB(query, List(SqlParameter("Int", id.toString))).map { _ =>
        "Deleted successfully"
      }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
