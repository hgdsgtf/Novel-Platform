package APIs.ReaderAPI

import Common.API.API
import Global.ServiceCenter.readerServiceCode
import io.circe.Decoder

abstract class ReaderMessage[ReturnType: Decoder]
    extends API[ReturnType](readerServiceCode)
