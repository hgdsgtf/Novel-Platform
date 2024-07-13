package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import APIs.AdminAPI.RegisterMessage

case class RegisterMessagePlanner(userName: String, userEmail: String, password: String, verificationCode: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // Check if the user is already registered
    try {
      val checkUserExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.adminemail_adminuser_adminpassword_adminbook WHERE adminuser = ?)",
        List(SqlParameter("String", userName))
      )
      val checkEmailExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.adminemail_adminuser_adminpassword_adminbook WHERE adminemail = ?)",
        List(SqlParameter("String", userEmail))
      )
      val checkVerificationCode = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.adminemail_adminverificationcode WHERE adminemail = ? AND adminverificationcode = ?)",
        List(SqlParameter("String", userEmail), SqlParameter("String", verificationCode))
      )
      checkUserExists.flatMap { userExists =>
        if (userExists) {
          IO.raiseError(new Exception("User already registered"))
        } else {
          checkEmailExists.flatMap { emailExists =>
            if (emailExists) {
              IO.raiseError(new Exception("Email already registered"))
            } else {
              checkVerificationCode.flatMap { verificationSucceeded =>
                if (!verificationSucceeded) {
                  IO.raiseError(new Exception("Verification failed"))
                } else {
                  writeDB(s"INSERT INTO ${schemaName}.adminemail_adminuser_adminpassword_adminbook (adminemail, adminuser, adminpassword, adminbook) VALUES (?, ?, ?, '{}')",
                    List(
                      SqlParameter("String", userEmail),
                      SqlParameter("String", userName),
                      SqlParameter("String", password)
                    )
                  ).map(_ => "Registered successfully")
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
