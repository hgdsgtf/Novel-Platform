package APIs.AuditorAPI

import Common.API.API
import Global.ServiceCenter.auditorServiceCode
import io.circe.Decoder

abstract class AuditorMessage[ReturnType: Decoder]
    extends API[ReturnType](auditorServiceCode)
