package Impl

import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import APIs.ReaderAPI.LoginMessage
import cats.effect.IO
import io.circe.generic.auto.*

case class BookshelfMessagePlanner(
    userName: String,
    override val planContext: PlanContext
) extends Planner[List[Json]]:
  override def plan(using planContext: PlanContext): IO[List[Json]] = {
    try {
      readDBRows(
        s"SELECT readerbook FROM ${schemaName}.readeremail_readeruser_readerpassword_readerbook_readermoney WHERE readeruser = ? ORDER BY readerbook ASC",
        List(SqlParameter("String", userName))
      )
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
