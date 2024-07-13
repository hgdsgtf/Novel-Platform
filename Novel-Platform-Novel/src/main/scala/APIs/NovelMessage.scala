package APIs

import Common.API.API
import Global.ServiceCenter.novelServiceCode
import io.circe.Decoder

abstract class NovelMessage[ReturnType: Decoder]
    extends API[ReturnType](novelServiceCode)
