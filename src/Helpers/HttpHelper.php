<?php
namespace Szurubooru\Helpers;

class HttpHelper
{
	public function setResponseCode($code)
	{
		http_response_code($code);
	}

	public function setHeader($key, $value)
	{
		header($key . ': ' . $value);
	}

	public function outputJSON($data)
	{
		$encodedJson = json_encode((array) $data);
		$lastError = json_last_error();
		if ($lastError !== JSON_ERROR_NONE)
			$this->output('Fatal error while encoding JSON: ' . $lastError . PHP_EOL . PHP_EOL . print_r($data, true));
		else
			$this->output($encodedJson);
	}

	public function output($data)
	{
		echo $data;
	}

	public function getRequestHeaders()
	{
		if (function_exists('getallheaders'))
		{
			return getallheaders();
		}
		$result = [];
		foreach ($_SERVER as $key => $value)
		{
			if (substr($key, 0, 5) == "HTTP_")
			{
				$key = str_replace(" ", "-", ucwords(strtolower(str_replace("_", " ", substr($key, 5)))));
				$result[$key] = $value;
			}
			else
			{
				$result[$key] = $value;
			}
		}
		return $result;
	}

	public function getRequestHeader($key)
	{
		$headers = $this->getRequestHeaders();
		return isset($headers[$key]) ? $headers[$key] : null;
	}

	public function getRequestMethod()
	{
		return $_SERVER['REQUEST_METHOD'];
	}

	public function getRequestUri()
	{
		$requestUri = $_SERVER['REQUEST_URI'];
		$requestUri = preg_replace('/\?.*$/', '', $requestUri);
		return $requestUri;
	}
}
