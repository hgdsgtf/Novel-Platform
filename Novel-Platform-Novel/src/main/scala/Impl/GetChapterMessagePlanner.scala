package Impl

import cats.effect.IO
import Common.API.{PlanContext, Planner}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import Common.DBAPI.readDBString
import java.sql.SQLException

sealed trait DBError extends Exception
case class SQLError(exception: SQLException) extends DBError
case class NotFoundError(message: String) extends DBError
case class UnknownError(exception: Throwable) extends DBError

case class GetChapterMessagePlanner(
    title: String,
    chapter: Int,
    override val planContext: PlanContext
) extends Planner[String] {

  override def plan(using planContext: PlanContext): IO[String] = {
    val query =
      s"SELECT content FROM ${schemaName}.novel WHERE title = ? AND chapter = ${chapter}"
    val params = List(SqlParameter("String", title))

    readDBString(query, params).attempt.flatMap {
      case Right(content) if content.nonEmpty => IO.pure(content)
      case Right(_) => IO.raiseError(NotFoundError("Content not found"))
      case Left(e: SQLException) => IO.raiseError(SQLError(e))
      case Left(e)               => IO.raiseError(UnknownError(e))
    }
  }
}
