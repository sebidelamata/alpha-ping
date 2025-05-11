import React, { useEffect, useMemo } from "react";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/components/ui/dialog";
import { Button } from "@/components/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/components/ui/radio-group";
import { Input } from "@/components/components/ui/input";
import { Label } from "@/components/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ISlippageSettings {
  slippage: string;
  setSlippage: React.Dispatch<React.SetStateAction<string>>;
}

// Zod schema for custom slippage validation
const formSchema = z.object({
  customSlippage: z
    .string()
    .optional()
    .refine(
      (val) => !val || (/^[0-9]*\.?[0-9]*$/.test(val) && !isNaN(Number(val))),
      { message: "Must be a valid number" }
    )
    .refine((val) => !val || Number(val) >= 0, { message: "Slippage cannot be negative" })
    .refine((val) => !val || Number(val) <= 100, { message: "Slippage cannot exceed 100%" })
    .refine(
      (val) => !val || !val.includes(".") || val.split(".")[1].length <= 2,
      { message: "Maximum 2 decimal places allowed" }
    ),
});

const SlippageSettings: React.FC<ISlippageSettings> = ({ slippage, setSlippage }) => {
  const predefinedOptions = useMemo(() => ["0.10", "0.25", "0.50", "0.75", "1.00"], []);

  // Initialize form with React Hook Form and Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customSlippage: "",
    },
    mode: "onChange", // Validate on every change
  });

  // Sync form with slippage prop
  useEffect(() => {
    if (!predefinedOptions.includes(slippage)) {
      form.setValue("customSlippage", slippage, { shouldValidate: true });
    } else {
      form.setValue("customSlippage", "", { shouldValidate: true });
      form.clearErrors("customSlippage");
    }
  }, [slippage, form, predefinedOptions]);

  // Update slippage when customSlippage changes and is valid
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "customSlippage" && value.customSlippage) {
        const errors = form.formState.errors.customSlippage;
        if (!errors) {
          setSlippage(Number(value.customSlippage).toString());
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setSlippage]);

  const handleRadioChange = (value: string) => {
    setSlippage(value);
    form.setValue("customSlippage", "", { shouldValidate: true });
    form.clearErrors("customSlippage");
  };

  return (
    <div className="flex w-full h-full justify-end">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" className="w-64">
            <Settings className="text-accent" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-3xl">Slippage Settings</DialogTitle>
            <DialogDescription>
              Adjust the slippage tolerance for your trade. Default is 1.00%.
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full h-full">
            <RadioGroup
              value={predefinedOptions.includes(slippage) ? slippage : "custom"}
              onValueChange={(value) => {
                if (value !== "custom") {
                  handleRadioChange(value);
                }
              }}
              className="flex flex-wrap gap-2"
            >
              {predefinedOptions.map((option) => (
                <div key={option} className="flex items-center">
                  <RadioGroupItem
                    value={option}
                    id={`slippage-${option}`}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`slippage-${option}`}
                    className={`px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors ${
                      slippage === option
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {option}%
                  </Label>
                </div>
              ))}
              <Form {...form}>
                <form className="flex items-center relative">
                  <FormField
                    control={form.control}
                    name="customSlippage"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start">
                        <div className="flex items-center">
                          <RadioGroupItem value="custom" id="slippage-custom" className="sr-only" />
                          <FormControl>
                            <Input
                              id="slippage-custom-input"
                              placeholder="Custom"
                              {...field}
                              className={`w-32 pr-6 text-sm ${
                                form.formState.errors.customSlippage
                                  ? "border-destructive"
                                  : slippage === field.value && field.value
                                  ? "border-primary"
                                  : "border-input"
                              }`}
                              pattern="^[0-9]*\.?[0-9]*$"
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck="false"
                            />
                          </FormControl>
                          <span className="absolute right-2 text-sm text-muted-foreground">%</span>
                        </div>
                        <FormMessage className="text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </RadioGroup>
          </div>
            <DialogFooter className="text-accent flex flex-row">
                Current selected slippage is {slippage}%. You can choose from predefined
                options or set a custom value.
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SlippageSettings;