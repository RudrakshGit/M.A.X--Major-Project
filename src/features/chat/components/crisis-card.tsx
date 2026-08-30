import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone } from "lucide-react";

export function CrisisCard() {
  return (
    <Card className="w-full max-w-md mx-auto shadow-sm border-signal/20 bg-signal/5">
      <CardHeader>
        <CardTitle className="text-xl font-display text-ink flex items-center gap-2">
          <Phone className="w-5 h-5 text-signal" />
          Urgent Help
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-ink/80 text-sm">
          It sounds like you are going through a very difficult time. M.A.X is an AI and cannot provide the help you need right now. Please reach out to one of these free, confidential resources.
        </p>
        <div className="space-y-3">
          <div className="flex items-start justify-between bg-surface rounded-md p-3">
            <div>
              <p className="font-semibold text-ink">Tele-MANAS</p>
              <p className="text-xs text-ink/70">Govt. of India, 24x7</p>
            </div>
            <a href="tel:14416" className="font-medium text-ink hover:underline">14416</a>
          </div>
          <div className="flex items-start justify-between bg-surface rounded-md p-3">
            <div>
              <p className="font-semibold text-ink">KIRAN</p>
              <p className="text-xs text-ink/70">13 languages, 24x7</p>
            </div>
            <a href="tel:18005990019" className="font-medium text-ink hover:underline">1800-599-0019</a>
          </div>
          <div className="flex items-start justify-between bg-surface rounded-md p-3">
            <div>
              <p className="font-semibold text-ink">Vandrevala Foundation</p>
              <p className="text-xs text-ink/70">Call and WhatsApp, 24x7</p>
            </div>
            <a href="tel:9999666555" className="font-medium text-ink hover:underline">9999 666 555</a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
