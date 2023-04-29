<template>
  <div>
    <v-card class="pa-4 vuepress-markdown-body">
      <v-card-title>FAQ</v-card-title>
      <v-expansion-panels variant="accordion">
        <v-expansion-panel :title="faqs.Where_is_the_input_and_the_output">
          <template v-slot:text>
            {{ faqs.Where_is_the_input_and_the_output_answer_part_1 }}
            <code>stdin</code> ('{{ faqs.Standard_Input }}'
            {{ faqs.Where_is_the_input_and_the_output_answer_part_3 }}
            <code>stdout</code> ('{{ faqs.Standard_Output }}'
            {{ faqs.Where_is_the_input_and_the_output_answer_part_5 }}
            <code>scanf</code>
            {{ faqs.Where_is_the_input_and_the_output_answer_part_6 }}
            <code>cin</code>
            {{ faqs.Where_is_the_input_and_the_output_answer_part_7 }}
            <code>printf</code>
            {{ faqs.Where_is_the_input_and_the_output_answer_part_8 }}
            <code>cout</code>
            {{ faqs.Where_is_the_input_and_the_output_answer_part_9 }}
            <code>Runtime Error</code>.
          </template>
        </v-expansion-panel>
        <v-expansion-panel
          :title="faqs.What_is_the_meaning_of_submission_execution_time"
        >
          <template v-slot:text>
            {{ faqs.What_is_the_meaning_of_submission_execution_time_answer }}
          </template>
        </v-expansion-panel>
        <v-expansion-panel :title="faqs.How_Can_I_use_CPP_Int64">
          <template v-slot:text>
            {{ faqs.How_Can_I_use_CPP_Int64_answer_part_1
            }}<code>long long</code>
            {{ faqs.How_Can_I_use_CPP_Int64_answer_part_2 }}
            <code>cin/cout</code> {{ faqs.or }} <code>%lld</code>,
            {{ faqs.using }}<code> __int64</code>
            {{ faqs.How_Can_I_use_CPP_Int64_answer_part_3 }}
            <code>Compile Error</code>.
          </template>
        </v-expansion-panel>
        <v-expansion-panel :title="faqs.Java_specifications">
          <template v-slot:text>
            {{ faqs.Java_specifications_answer_part_1 }} <code>Main</code>
            {{ faqs.Java_specifications_answer_part_2 }} <code>Main</code>
            {{ faqs.Java_specifications_answer_part_3 }}
          </template>
        </v-expansion-panel>
        <v-expansion-panel :title="faqs.About_presentation_error">
          <template v-slot:text>
            {{ faqs.About_presentation_error_answer_part_1 }}
            <b>{{ faqs.last }}</b>
            {{ faqs.About_presentation_error_answer_part_2 }}
            <code> Wrong Answer</code>.
          </template>
        </v-expansion-panel>
        <v-expansion-panel :title="faqs.How_to_report_bugs">
          <template v-slot:text>
            {{ faqs.How_to_report_bugs_answer_part_1 }}
            <a href="https://github.com/QingdaoU/OnlineJudge">Github</a>
            {{ faqs.How_to_report_bugs_answer_part_2 }}
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <v-card class="pa-4 mt-3">
      Frontend redesign by <a href="https://andyjjrt.cc">andyjjrt</a>, Backend
      supported by
      <a href="https://github.com/QingdaoU/OnlineJudge">OnlineJudge</a>.
      <br />
      Frontend bug report please create issue in
      <a href="https://github.com/andyjjrt/ojFE/issues">Github</a>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const faqs = {
  Frequently_Asked_Questions: "Frequently Asked Questions",
  Where_is_the_input_and_the_output: "Where is the input and the output?",
  Where_is_the_input_and_the_output_answer_part_1:
    "Your program shall read input from",
  Standard_Input: "Standard Input",
  Where_is_the_input_and_the_output_answer_part_3: "and write output to",
  Standard_Output: "Standard Output",
  Where_is_the_input_and_the_output_answer_part_5: "For example,you can use",
  Where_is_the_input_and_the_output_answer_part_6: "in C or",
  Where_is_the_input_and_the_output_answer_part_7:
    "in C++ to read from stdin,and use",
  Where_is_the_input_and_the_output_answer_part_8: "in C or",
  Where_is_the_input_and_the_output_answer_part_9:
    "in C++ to write to stdout.  User programs are not allowed to read or write files, or you will get a",
  What_is_the_meaning_of_submission_execution_time:
    "What's the meaning of the submission execution time?",
  What_is_the_meaning_of_submission_execution_time_answer:
    "The onlinejudge might test your code multiple times with different input files. If your code gives the correct answer within the time limit for each input file, the execution time displayed is the max of the time spent for each test case. Otherwise, the execution time will have no sense.",
  How_Can_I_use_CPP_Int64: "How can I use C++ Int64?",
  How_Can_I_use_CPP_Int64_answer_part_1: "You should declare as",
  How_Can_I_use_CPP_Int64_answer_part_2: "and use with",
  or: "or",
  using: "using",
  How_Can_I_use_CPP_Int64_answer_part_3: "will result in",
  Java_specifications: "Java specifications?",
  Java_specifications_answer_part_1:
    "All programs must begin in a static main method in a",
  Java_specifications_answer_part_2: "class. Do not use public classes: even",
  Java_specifications_answer_part_3:
    "must be non public to avoid compile error.Use buffered I/O to avoid time limit exceeded due to excesive flushing.",
  About_presentation_error: "About presentation error?",
  About_presentation_error_answer_part_1:
    "There is no presentation error in this oj.The judger will trim the blacks and wraps in your ouput's",
  last: "last",
  About_presentation_error_answer_part_2:
    "line.  if it's still different with the correct output, the result will be",
  How_to_report_bugs: "How to report bugs about this oj?",
  How_to_report_bugs_answer_part_1:
    "The onlinejudge is open source, you can open an issue in",
  How_to_report_bugs_answer_part_2:
    "The details(like env, version.. about a bug is required, which will help us a lot to solve the bug. Certainly, we are very pleased to merge your pull requests.",
};
</script>
