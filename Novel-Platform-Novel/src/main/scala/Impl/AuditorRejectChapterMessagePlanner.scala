package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBString, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

import java.sql.SQLException

case class AuditorRejectChapterMessagePlanner(
    title: String,
    chapter: Int,
    comment: String,
    override val planContext: PlanContext
) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    val query =
      s"UPDATE ${schemaName}.novel SET status = 3, issues = '{}', auditorcomment = ?, writerreason = '' WHERE title = ? AND chapter = ${chapter}"
    val params =
      List(SqlParameter("String", comment), SqlParameter("String", title))
    writeDB(query, params).attempt.flatMap {
      case Right(_)              => IO.pure("Reject successfully")
      case Left(e: SQLException) => IO.raiseError(SQLError(e))
      case Left(e: DBError)      => IO.raiseError(e)
      case Left(e)               => IO.raiseError(UnknownError(e))
    }
  }
