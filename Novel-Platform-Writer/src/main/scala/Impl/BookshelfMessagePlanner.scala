package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*

case class BookshelfMessagePlanner(
    userName: String,
    override val planContext: PlanContext
) extends Planner[List[Json]]:
  override def plan(using planContext: PlanContext): IO[List[Json]] = {
    try {
      readDBRows(
        s"SELECT writerbook FROM ${schemaName}.writeremail_writeruser_writerpassword_writerbook WHERE writeruser = ?",
        List(SqlParameter("String", userName))
      )
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
