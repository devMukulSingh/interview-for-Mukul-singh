import { useLaunches } from "store/store";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import useUrlSearchParams from "~/lib/hooks/useUrlSearchParams";
import { Badge } from "./ui/badge";

import { TLaunchDetail } from "~/lib/types";
import { Link } from "@remix-run/react";
import { format } from "date-fns";

type Props = {
  // children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export default function LaunchDetailDialog({ isOpen, onClose }: Props) {
  const { getParams } = useUrlSearchParams();
  const activeId = getParams("activeId");
  const { launchesData } = useLaunches();
  const activeLaunchData: TLaunchDetail = launchesData?.find(
    (data) => data.id === activeId
  );
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="py-2 sm:py-5 px-4">
        <div className="sm:h-fit">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0">
              <img
                src={activeLaunchData?.image}
                alt="CRS-1 Mission Patch"
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeLaunchData?.mission}
                </h2>
                <Badge
                  className={
                    activeLaunchData?.status === "Success"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : activeLaunchData?.status === "Failed"
                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  }
                >
                  {activeLaunchData?.status === "Success"
                    ? "Success"
                    : activeLaunchData?.status === "Failed"
                    ? "Failed"
                    : "Upcoming"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {activeLaunchData?.rocket}
              </p>
              <div className="flex items-center space-x-1">
                <Link
                  target="_blank"
                  to={activeLaunchData?.links?.article || "#"}
                >
                  {" "}
                  <img src="/nasa.svg" className="size-6" />
                </Link>
                <Link
                  target="_blank"
                  to={activeLaunchData?.links?.wikipedia || "#"}
                >
                  <img src="/wikipedia.svg" className="size-6" />
                </Link>
                <Link
                  target="_blank"
                  to={activeLaunchData?.links?.webcast || "#"}
                >
                  <img src="/youtube.svg" className="size-6" />
                </Link>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              <p>
                {activeLaunchData?.description}
                <a
                  target="_blank"
                  href={activeLaunchData?.links?.wikipedia || "#"}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Wikipedia
                </a>
              </p>
            </div>

            <div className="sm:space-y-1">
              <KeyValue
                value={activeLaunchData?.flightNumber?.toString()}
                itemKey="Flight Number"
              />
              <KeyValue
                value={activeLaunchData?.mission}
                itemKey="Mission Name"
              />
              <KeyValue
                value={activeLaunchData?.rocketType}
                itemKey="Rocket Type"
              />
              <KeyValue
                value={activeLaunchData?.rocket}
                itemKey="Rocket Name"
              />
              <KeyValue
                value={activeLaunchData?.manufacturer}
                itemKey="Manufacturer"
              />
              <KeyValue
                value={activeLaunchData?.nationality}
                itemKey="Nationality"
              />
              <KeyValue
                value={
                  activeLaunchData?.launched &&
                  format(activeLaunchData?.launched, "dd MMMM yyyy dd:mm")
                }
                itemKey="Launch Date"
              />
              <KeyValue
                value={activeLaunchData?.payloadType}
                itemKey="Payload Type"
              />
              <KeyValue value={activeLaunchData?.orbit} itemKey="Orbit" />
              <KeyValue
                value={activeLaunchData?.launchSite}
                itemKey="Launch Site"
              />
            </div>
          </div>
          
        </div>
      </DialogContent>
    </Dialog>
  );
}
////////////////////////////////////////////////
function KeyValue({
  itemKey,
  value,
}: {
  itemKey: string;
  value: string | undefined;
}) {
  return (
    <div className="flex sm:items-start py-2 border-b sm:justify-normal justify-between">
      <p className="text-xs sm:text-sm text-gray-600 font-medium sm:w-40  mr-4">
        {itemKey}
      </p>
      <p className="text-xs sm:text-sm text-gray-900 font-medium sm:text-right">
        {value}
      </p>
    </div>
  );
}
