package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class UserResetMessagePlanner(
    userName: String,
    password: String,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    try {
      writeDB(
        s"UPDATE ${schemaName}.userInfo SET password = ? WHERE userName = ?",
        List(SqlParameter("String", password), SqlParameter("String", userName))
      )
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
