package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import java.sql.SQLException

case class RegisterMessagePlanner(
    userName: String,
    userEmail: String,
    password: String,
    verificationCode: String,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    val checkUserExists = readDBBoolean(
      s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.auditoremail_auditoruser_auditorpassword_auditorstatus WHERE auditoruser = ?)",
      List(SqlParameter("String", userName))
    )

    val checkEmailExists = readDBBoolean(
      s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.auditoremail_auditoruser_auditorpassword_auditorstatus WHERE auditoremail = ?)",
      List(SqlParameter("String", userEmail))
    )

    val checkVerificationCode = readDBBoolean(
      s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.auditoremail_auditorverificationcode WHERE auditoremail = ? AND auditorverificationcode = ?)",
      List(
        SqlParameter("String", userEmail),
        SqlParameter("String", verificationCode)
      )
    )

    for {
      userExists <- checkUserExists.attempt
      _ <- userExists match {
        case Right(true) =>
          IO.raiseError(new Exception("User already registered"))
        case Left(e: SQLException) => IO.raiseError(SQLError(e))
        case Left(e)               => IO.raiseError(UnknownError(e))
        case _                     => IO.unit
      }
      emailExists <- checkEmailExists.attempt
      _ <- emailExists match {
        case Right(true) =>
          IO.raiseError(new Exception("Email already registered"))
        case Left(e: SQLException) => IO.raiseError(SQLError(e))
        case Left(e)               => IO.raiseError(UnknownError(e))
        case _                     => IO.unit
      }
      verificationSucceeded <- checkVerificationCode.attempt
      _ <- verificationSucceeded match {
        case Right(false) => IO.raiseError(new Exception("Verification failed"))
        case Left(e: SQLException) => IO.raiseError(SQLError(e))
        case Left(e)               => IO.raiseError(UnknownError(e))
        case _                     => IO.unit
      }
      _ <- writeDB(
        s"INSERT INTO ${schemaName}.auditoremail_auditoruser_auditorpassword_auditorstatus (auditoremail, auditoruser, auditorpassword, auditorstatus) VALUES (?, ?, ?, FALSE)",
        List(
          SqlParameter("String", userEmail),
          SqlParameter("String", userName),
          SqlParameter("String", password)
        )
      ).attempt.flatMap {
        case Right(_)              => IO.pure("Registered successfully")
        case Left(e: SQLException) => IO.raiseError(SQLError(e))
        case Left(e)               => IO.raiseError(UnknownError(e))
      }
    } yield "Registered successfully"
  }
}
