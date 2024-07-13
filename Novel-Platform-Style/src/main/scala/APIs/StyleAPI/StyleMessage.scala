package APIs.StyleAPI

import Common.API.API
import Global.ServiceCenter.styleServiceCode
import io.circe.Decoder

abstract class StyleMessage[ReturnType: Decoder]
    extends API[ReturnType](styleServiceCode)
