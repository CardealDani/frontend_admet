// src/components/results/filters/FilterSection.tsx

import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FilterSectionProps {
    title: string;
    icon: React.ReactNode;
    badgeCount?: string | number;
    badgeType?: 'default' | 'error';
    defaultExpanded?: boolean;
    children: React.ReactNode;
}

export const FilterSection = ({ title, icon, badgeCount, badgeType = 'default', children, defaultExpanded = false }: FilterSectionProps) => {
    const badgeClass = badgeType === 'error'
        ? 'bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold'
        : 'bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-gray-200';

    return (
        <div className="mb-2 mx-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <Accordion
                defaultExpanded={defaultExpanded}
                disableGutters
                elevation={0}
                sx={{ backgroundColor: 'transparent', '&:before': { display: 'none' } }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon className="text-gray-400" />}
                    sx={{ minHeight: '48px', '& .MuiAccordionSummary-content': { margin: '12px 0' }, paddingX: '16px', borderBottom: '1px solid #f3f4f6' }}
                    className="hover:bg-gray-50/50 transition-colors"
                >
                    <div className="flex items-center justify-between w-full pr-2">
                        <div className="flex items-center gap-2 text-gray-800">
                            {icon}
                            <Typography className="font-nunito_sans font-extrabold text-[14px]">
                                {title}
                            </Typography>
                        </div>
                        {badgeCount && (
                            <span className={badgeClass}>{badgeCount}</span>
                        )}
                    </div>
                </AccordionSummary>
                <AccordionDetails className="px-5 pt-0 pb-5">
                    {children}
                </AccordionDetails>
            </Accordion>
        </div>
    );
};