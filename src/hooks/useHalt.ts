import { useRecoilState } from "recoil";
import { _halt, _haltReason } from "../state/mode";

// Hook to handle halting the canvas
export default function useHalt(reason: string) {
  const [halt, setHalt] = useRecoilState(_halt);
  const [haltReason, setHaltReason] = useRecoilState(_haltReason);

  return [
    halt && haltReason === reason,
    () => {
        if(!halt) {
            setHalt(true);
            setHaltReason(reason);
        }
    },
    () => {
        if(halt && haltReason === reason) {
            setHalt(false);
        }
    }
  ] as const;
}
