package Process

import Common.API.{API, PlanContext, TraceID}
import Global.{ServerConfig, ServiceCenter}
import Common.DBAPI.{initSchema, readDBBoolean, writeDB}
import Common.Object.SqlParameter
import Common.PasswordUtils
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*
import org.http4s.client.Client

import java.util.UUID

object Init {
  def init(config: ServerConfig): IO[Unit] = {
    given PlanContext =
      PlanContext(traceID = TraceID(UUID.randomUUID().toString), 0)
    for {
      _ <- API.init(config.maximumClientConnection)
      _ <- initSchema(schemaName)
      _ <- writeDB(
        s"CREATE TABLE IF NOT EXISTS ${schemaName}.userVerification (email TEXT, verificationCode TEXT)",
        List()
      )
      _ <- writeDB(
        s"CREATE TABLE IF NOT EXISTS ${schemaName}.userInfo (userID SERIAL PRIMARY KEY, email TEXT, userName TEXT, password TEXT, userToken TEXT, tokenExpire TEXT, userType INTEGER, isDeleted BOOLEAN)",
        List()
      )
      exists <- readDBBoolean(
        s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.userInfo WHERE userName = ?)",
        List(SqlParameter("String", "admin"))
      )
      hashedPassword <- IO.pure(PasswordUtils.hashPassword("123456"))
      _ <-
        if (!exists) {
          writeDB(
            s"INSERT INTO ${schemaName}.userInfo (email, userName, password, userToken, tokenExpire, userType, isDeleted) VALUES ('', 'admin', ?, '', '', 0, FALSE)",
            List(SqlParameter("String", hashedPassword))
          )
        } else {
          IO.unit
        }
    } yield ()
  }
}
