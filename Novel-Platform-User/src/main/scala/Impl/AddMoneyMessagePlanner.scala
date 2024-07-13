package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBBoolean, readDBRows, readDBString, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*

case class AddMoneyMessagePlanner(
    userName: String,
    addamount: Int,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    try {
      writeDB(
        s"UPDATE ${schemaName}.readeremail_readeruser_readerpassword_readerbook_readermoney SET readermoney = readermoney + ${addamount} WHERE readeruser = ?",
        List(
          SqlParameter("String", userName)
        )
      ).map { _ => "Added successfully" }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
