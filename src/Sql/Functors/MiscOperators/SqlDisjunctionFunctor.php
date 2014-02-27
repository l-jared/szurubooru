<?php
class SqlDisjunctionFunctor extends SqlVariableFunctor
{
	public function getAsStringEmpty()
	{
		return '1';
	}

	public function getAsStringNonEmpty()
	{
		return '(' . join(' OR ', array_map(function($subject)
		{
			return self::surroundBraces($subject);
		}, $this->subjects)) . ')';
	}
}