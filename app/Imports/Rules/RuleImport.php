<?php

namespace App\Imports\Rules;

use App\Models\Rule;
use Illuminate\Support\Facades\DB;

class RuleImport
{
    public function run($file)
    {
        //todo validate json
        DB::transaction(function () use ($file) {
            Rule::query()->delete();
            $json = file_get_contents($file);
            $data = json_decode($json);
            foreach ($data as $ruleData) {
                $rule = new Rule();
                $rule->name = $ruleData->name;
                $rule->type = $ruleData->type;
                if (isset($ruleData->params)) {
                    $rule->params = $ruleData->params;
                }
                $rule->save();
            }
        });
    }
}
