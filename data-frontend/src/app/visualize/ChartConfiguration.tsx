import React, { memo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ComboboxDemo } from "@/components/ComboBox";
import useDataOverviewStore from "@/store/DataOverview";
import { Settings, Play, ChevronDown } from "lucide-react";

export interface ChartConfig {
  x: string;
  y: string[] | null;
  chartType: string;
  hue: string;
  style: string;
  size: string;
  kde: boolean;
  multiple: string;
  cols: number | null;
}

interface ChartConfigurationProps {
  onGenerate: (config: ChartConfig) => void;
  isGenerating: boolean;
}

const ChartConfiguration = memo(({ onGenerate, isGenerating }: ChartConfigurationProps) => {
  const columns = useDataOverviewStore((state) => state.columnsInfo);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [config, setConfig] = useState<ChartConfig>({
    x: "",
    y: null,
    chartType: "bar",
    hue: "",
    style: "",
    size: "",
    kde: false,
    multiple: "layer",
    cols: null,
  });

  const updateConfig = useCallback((key: keyof ChartConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleGenerate = useCallback(() => {
    onGenerate(config);
  }, [config, onGenerate]);

  const categoricalColumns = columns?.filter(col => col.type === 'categorical') || [];
  const numericColumns = columns?.filter(col => col.type === 'numeric') || [];

  return (
    <div className="glass dark:inset-shadow-[0_1px_rgb(255_255_255/0.15)] border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-4 h-4" />
        <h3 className="font-semibold">Chart Configuration</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* X Variable */}
        <div>
          <Label className="text-sm font-medium">X Variable</Label>
          <Select onValueChange={(value) => updateConfig('x', value)} value={config.x}>
            <SelectTrigger>
              <SelectValue placeholder="Select X" />
            </SelectTrigger>
            <SelectContent>
              {columns?.map((column) => (
                <SelectItem key={column.name} value={column.name}>
                  <div className="flex items-center gap-2">
                    <span>{column.name}</span>
                    <Badge variant="secondary" className="text-xs">{column.type}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Y Variables */}
        <div>
          <Label className="text-sm font-medium">Y Variables</Label>
          <ComboboxDemo 
            selectedValues={(value) => updateConfig('y', value)}
            placeholder="Select Y variables"
          />
        </div>

        {/* Chart Type */}
        <div>
          <Label className="text-sm font-medium">Chart Type</Label>
          <Select onValueChange={(value) => updateConfig('chartType', value)} value={config.chartType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
              <SelectItem value="scatter">Scatter Plot</SelectItem>
              <SelectItem value="histogram">Histogram</SelectItem>
              <SelectItem value="boxplot">Box Plot</SelectItem>
              <SelectItem value="violin">Violin Plot</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="radar">Radar Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Generate Button */}
        <div className="flex items-end">
          <Button 
            onClick={handleGenerate} 
            disabled={!config.x || isGenerating}
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Chart'}
          </Button>
        </div>
      </div>

      {/* Advanced Options */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <div className="border-t pt-4">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center justify-between w-full p-0 h-auto font-medium text-sm">
              <span>Advanced Options</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-200 ${
                  isAdvancedOpen ? 'transform rotate-180' : ''
                }`} 
              />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="data-[state=open]:animate-accordion-down transition-all data-[state=closed]:animate-accordion-up overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-end gap-4 pt-4 ">
              {/* Hue */}
              <div>
                <Label className="text-xs text-muted-foreground">Color By (Hue)</Label>
                <Select onValueChange={(value) => updateConfig('hue', value === 'none' ? '' : value)} value={config.hue || 'none'}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {categoricalColumns.map((column) => (
                      <SelectItem key={column.name} value={column.name}>
                        {column.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Style */}
              <div>
                <Label className="text-xs text-muted-foreground">Style By</Label>
                <Select onValueChange={(value) => updateConfig('style', value === 'none' ? '' : value)} value={config.style || 'none'}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {categoricalColumns.map((column) => (
                      <SelectItem key={column.name} value={column.name}>
                        {column.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Size */}
              <div>
                <Label className="text-xs text-muted-foreground">Size By</Label>
                <Select onValueChange={(value) => updateConfig('size', value === 'none' ? '' : value)} value={config.size || 'none'}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {numericColumns.map((column) => (
                      <SelectItem key={column.name} value={column.name}>
                        {column.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Multiple */}
              <div>
                <Label className="text-xs text-muted-foreground">Multiple</Label>
                <Select onValueChange={(value) => updateConfig('multiple', value === 'none' ? '' : value)} value={config.multiple || 'none'}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="layer">Layer</SelectItem>
                    <SelectItem value="stack">Stack</SelectItem>
                    <SelectItem value="dodge">Dodge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* KDE Toggle */}
              <div className="flex items-center space-x-2 pb-1">
                <Switch
                  id="kde"
                  checked={config.kde}
                  onCheckedChange={(checked) => updateConfig('kde', checked)}
                />
                <Label htmlFor="kde" className="text-xs text-muted-foreground">KDE</Label>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
});

ChartConfiguration.displayName = 'ChartConfiguration';

export default ChartConfiguration;