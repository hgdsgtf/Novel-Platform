package Impl

import APIs.AdminAPI.RegisterMessage
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class ResetMessagePlanner(userName: String, userEmail: String, password: String, verificationCode: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // Check if the user is already registered
    try {
      val checkUserExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.adminemail_adminuser_adminpassword_adminbook WHERE adminuser = ? AND adminemail != ?)",
        List(SqlParameter("String", userName), SqlParameter("String", userEmail))
      )
      val checkEmailExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.adminemail_adminuser_adminpassword_adminbook WHERE adminemail = ?)",
        List(SqlParameter("String", userEmail))
      )
      val checkVerificationCode = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.adminemail_adminverificationcode WHERE adminemail = ? AND adminverificationcode = ?)",
        List(SqlParameter("String", userEmail), SqlParameter("String", verificationCode))
      )
      checkEmailExists.flatMap { emailExists =>
        if (!emailExists) {
          IO.raiseError(new Exception("Email hasn't registered"))
        } else {
          checkUserExists.flatMap { userExists =>
            if (userExists) {
              IO.raiseError(new Exception("Duplicate user"))
            } else {
              checkVerificationCode.flatMap { verificationSucceeded =>
                if (!verificationSucceeded) {
                  IO.raiseError(new Exception("Verification failed"))
                } else {
                  writeDB(s"UPDATE ${schemaName}.adminemail_adminuser_adminpassword_adminbook SET adminuser = ?, adminpassword = ? WHERE adminemail = ?",
                    List(
                      SqlParameter("String", userName),
                      SqlParameter("String", password),
                      SqlParameter("String", userEmail)
                    )
                  ).map(_ => "Modified successfully")
                }
              }
            }
          }
        }
      }
    } catch {
      case e:Exception => IO.raiseError(new Exception("System error"))
    }
  }
}