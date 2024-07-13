package Common

import cats.effect.IO
import io.circe.{Decoder, DecodingFailure, Encoder, Json, JsonObject}
import org.joda.time.DateTime
import org.joda.time.format.ISODateTimeFormat
import org.mindrot.jbcrypt.BCrypt

object PasswordUtils {
  def hashPassword(password: String): String = {
    val salt = BCrypt.gensalt()
    BCrypt.hashpw(password, salt)
  }
  def checkPassword(password: String, hashedPassword: String): Boolean = {
    BCrypt.checkpw(password, hashedPassword)
  }
}
