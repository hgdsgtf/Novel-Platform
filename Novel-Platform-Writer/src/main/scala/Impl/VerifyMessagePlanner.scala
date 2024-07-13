package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class VerifyMessagePlanner(
    userEmail: String,
    verificationCode: String,
    override val planContext: PlanContext
) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // Check if the user is already registered
    try {
      val checkVerificationCode = readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.writeremail_writerverificationcode WHERE writeremail = ? AND writerverificationcode = ?)",
        List(
          SqlParameter("String", userEmail),
          SqlParameter("String", verificationCode)
        )
      )
      val checkEmailExists = readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.writeremail_writeruser_writerpassword_writerbook WHERE writeremail = ?)",
        List(SqlParameter("String", userEmail))
      )
      checkVerificationCode.flatMap { verification =>
        if (!verification) {
          IO.raiseError(new Exception("Verification failed"))
        } else {
          checkEmailExists.flatMap { emailexists =>
            if (!emailexists) {
              IO.raiseError(new Exception("Email doesn't exist"))
            } else {
              IO.pure("Verification succeeded")
            }
          }
        }
      }
    } catch {
      case e: Exception => IO.raiseError(new Exception("System error"))
    }
  }
}
