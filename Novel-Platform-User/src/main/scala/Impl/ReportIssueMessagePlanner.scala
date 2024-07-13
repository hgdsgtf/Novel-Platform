package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBString, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*
import java.sql.SQLException

sealed trait DBError extends Exception
case object InvalidParameterError extends DBError
case class SQLError(exception: SQLException) extends DBError
case class UnknownError(exception: Throwable) extends DBError

case class ReportIssueMessagePlanner(
    title: String,
    chapter: Int,
    issue: String,
    override val planContext: PlanContext
) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    val query =
      s"UPDATE novel.novel SET status = 2, issues = issues || ? WHERE title = ? AND chapter = ${chapter}"
    val params =
      List(SqlParameter("String", issue), SqlParameter("String", title))
    writeDB(query, params).attempt.flatMap {
      case Right(_)              => IO.pure("Reject successfully")
      case Left(e: SQLException) => IO.raiseError(SQLError(e))
      case Left(e: DBError)      => IO.raiseError(e)
      case Left(e)               => IO.raiseError(UnknownError(e))
    }
  }
