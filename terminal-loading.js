const A = "#include <linux/jiffies.h>\n\
#include <linux/delay.h>\n\
#include <linux/init.h>\n\
#include <linux/timex.h>\n\
#include <linux/smp.h>\n\
#include <linux/percpu.h>\n\
\n\
unsigned long lpj_fine;\n\
unsigned long preset_lpj;\n\
static int __init lpj_setup(char *str)\n\
{\n\
\tpreset_lpj = simple_strtoul(str,NULL,0);\n\
\treturn 1;\n\
}\n\
\n\
__setup(\"lpj=\", lpj_setup);";
const B = "static unsigned long calibrate_delay_direct(void)\n\
{\n\
\tunsigned long pre_start, start, post_start;\n\
\tunsigned long pre_end, end, post_end;\n\
\tunsigned long start_jiffies;\n\
\tunsigned long timer_rate_min, timer_rate_max;\n\
\tunsigned long good_timer_sum = 0;\n\
\tunsigned long good_timer_count = 0;\n\
\tunsigned long measured_times[MAX_DIRECT_CALIBRATION_RETRIES];\n\
\tint max = -1; /* index of measured_times with max/min values or not set */\n\
\tint min = -1;\n\
\tint i;\n\
\n\
\tif (read_current_timer(&pre_start) < 0 )\n\
\t\treturn 0;\n\
\n\
\t/*\n\
\t * A simple loop like\n\
\t *\twhile ( jiffies < start_jiffies+1)\n\
\t *\t\tstart = read_current_timer();\n\
\t * will not do. As we don't really know whether jiffy switch\n\
\t * happened first or timer_value was read first. And some asynchronous\n\
\t * event can happen between these two events introducing errors in lpj.\n\
\t *\n\
\t * So, we do\n\
\t * 1. pre_start <- When we are sure that jiffy switch hasn't happened\n\
\t * 2. check jiffy switch\n\
\t * 3. start <- timer value before or after jiffy switch\n\
\t * 4. post_start <- When we are sure that jiffy switch has happened\n\
\t *\n\
\t * Note, we don't know anything about order of 2 and 3.\n\
\t * Now, by looking at post_start and pre_start difference, we can\n\
\t * check whether any asynchronous event happened or not\n\
\t */";
const C = "for (i = 0; i < MAX_DIRECT_CALIBRATION_RETRIES; i++) {\n\
\t\tpre_start = 0;\n\
\t\tread_current_timer(&start);\n\
\t\tstart_jiffies = jiffies;\n\
\t\twhile (time_before_eq(jiffies, start_jiffies + 1)) {\n\
\t\t\tpre_start = start;\n\
\t\t\tread_current_timer(&start);\n\
\t\t}\n\
\t\tread_current_timer(&post_start);\n\
\n\
\t\tpre_end = 0;\n\
\t\tend = post_start;\n\
\t\twhile (time_before_eq(jiffies, start_jiffies + 1 +\n\
\t\t\t\t\t       DELAY_CALIBRATION_TICKS)) {\n\
\t\t\tpre_end = end;\n\
\t\t\tread_current_timer(&end);\n\
\t\t}\n\
\t\tread_current_timer(&post_end);\n\
\n\
\t\ttimer_rate_max = (post_end - pre_start) /\n\
\t\t\t\t\tDELAY_CALIBRATION_TICKS;\n\
\t\ttimer_rate_min = (pre_end - post_start) /\n\
\t\t\t\t\tDELAY_CALIBRATION_TICKS;\n\
";
const D = "if (start >= post_end)\n\
\t\t\tprintk(KERN_NOTICE \"calibrate_delay_direct() ignoring \"\n\
\t\t\t\t\t\"timer_rate as we had a TSC wrap around\"\n\
\t\t\t\t\t\" start=%lu >=post_end=%lu\\n\",\n\
\t\t\t\tstart, post_end);\n\
\t\tif (start < post_end && pre_start != 0 && pre_end != 0 &&\n\
\t\t    (timer_rate_max - timer_rate_min) < (timer_rate_max >> 3)) {\n\
\t\t\tgood_timer_count++;\n\
\t\t\tgood_timer_sum += timer_rate_max;\n\
\t\t\tmeasured_times[i] = timer_rate_max;\n\
\t\t\tif (max < 0 || timer_rate_max > measured_times[max])\n\
\t\t\t\tmax = i;\n\
\t\t\tif (min < 0 || timer_rate_max < measured_times[min])\n\
\t\t\t\tmin = i;\n\
\t\t} else\n\
\t\t\tmeasured_times[i] = 0;\n\
\n\
\t}";
const E = "\twhile (good_timer_count > 1) {\n\
\t\tunsigned long estimate;\n\
\t\tunsigned long maxdiff;\n\
\n\
\t\t/* compute the estimate */\n\
\t\testimate = (good_timer_sum/good_timer_count);\n\
\t\tmaxdiff = estimate >> 3;\n\
\n\
\t\t/* if range is within 12% let's take it */\n\
\t\tif ((measured_times[max] - measured_times[min]) < maxdiff)\n\
\t\t\treturn estimate;\n\
\n\
\t\t/* ok - drop the worse value and try again... */\n\
\t\tgood_timer_sum = 0;\n\
\t\tgood_timer_count = 0;\n\
\t\tif ((measured_times[max] - estimate) <\n\
\t\t\t\t(estimate - measured_times[min])) {\n\
\t\t\tprintk(KERN_NOTICE \"calibrate_delay_direct() dropping \"\n\
\t\t\t\t\t\"min bogoMips estimate %d = %lu\\n\",\n\
\t\t\t\tmin, measured_times[min]);\n\
\t\t\tmeasured_times[min] = 0;\n\
\t\t\tmin = max;\n\
\t\t} else {\n\
\t\t\tprintk(KERN_NOTICE \"calibrate_delay_direct() dropping \"\n\
\t\t\t\t\t\"max bogoMips estimate %d = %lu\\n\",\n\
\t\t\t\tmax, measured_times[max]);\n\
\t\t\tmeasured_times[max] = 0;\n\
\t\t\tmax = min;\n\
\t\t}";
const F = "\t\tfor (i = 0; i < MAX_DIRECT_CALIBRATION_RETRIES; i++) {\n\
\t\t\tif (measured_times[i] == 0)\n\
\t\t\t\tcontinue;\n\
\t\t\tgood_timer_count++;\n\
\t\t\tgood_timer_sum += measured_times[i];\n\
\t\t\tif (measured_times[i] < measured_times[min])\n\
\t\t\t\tmin = i;\n\
\t\t\tif (measured_times[i] > measured_times[max])\n\
\t\t\t\tmax = i;\n\
\t\t}\n\
\n\
\t}\n\
\n\
\tprintk(KERN_NOTICE \"calibrate_delay_direct() failed to get a good \"\n\
\t       \"estimate for loops_per_jiffy.\\nProbably due to long platform \"\n\
\t\t\"interrupts. Consider using \\\"lpj=\\\" boot option.\\n\");\n\
\treturn 0;\n\
}";

document.body.insertAdjacentHTML("afterBegin", "<div id=\"preloadContainer\"></div>");
var preload = document.getElementById("preloadContainer");
preload.insertAdjacentHTML("afterBegin", "<div>"+A+"</div>");
setTimeout(function(){preload.insertAdjacentHTML("afterBegin", "<div>"+B+"</div>")}, 300);
setTimeout(function(){preload.insertAdjacentHTML("afterBegin", "<div>"+C+"</div>")}, 800);
setTimeout(function(){preload.insertAdjacentHTML("afterBegin", "<div>"+D+"</div>")}, 1100);
setTimeout(function(){preload.insertAdjacentHTML("afterBegin", "<div>"+E+"</div>")}, 1600);
setTimeout(function(){preload.insertAdjacentHTML("afterBegin", "<div>"+F+"</div>")}, 2100);

setTimeout(function() {
	var elem = document.querySelector("#preloadContainer");
	elem.remove();
    }, 2600
);