package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{
  readDBBoolean,
  readDBInt,
  readDBRows,
  readDBString,
  writeDB
}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*

case class GetMoneyMessagePlanner(
    userName: String,
    override val planContext: PlanContext
) extends Planner[Int] {
  override def plan(using PlanContext): IO[Int] = {
    try {
      readDBInt(
        s"SELECT readermoney FROM ${schemaName}.readeremail_readeruser_readerpassword_readerbook_readermoney WHERE readeruser = ?",
        List(
          SqlParameter("String", userName)
        )
      )
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
